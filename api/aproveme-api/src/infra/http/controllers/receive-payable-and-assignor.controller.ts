import { CreateAssignorService } from "@/domain/receivables/application/services/create-assignor-service";
import { CreatePayableService } from "@/domain/receivables/application/services/create-payable-service";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { randomUUID } from "crypto";
import { Public } from "@/infra/auth/public";
import { PayablePresenter } from "../presenters/payable-presenter";
import { AssignorPresenter } from "../presenters/assignor-presenter";

const receivePayableAndAssignorSchema = z.object({
  payable: z.object({
    value: z.number(),
    emissionDate: z.string(),
  }),
  assignor: z.object({
    document: z.string().max(30),
    email: z.string().max(140),
    phone: z.string().max(20),
    name: z.string().max(140),
  }),
});

type ReceivePayableAndAssignorBodySchema = z.infer<
  typeof receivePayableAndAssignorSchema
>;

@Controller("/integrations/payable")
@Public()
export class ReceivePayableAndAssignorController {
  constructor(
    private createAssignor: CreateAssignorService,
    private createPayable: CreatePayableService
  ) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Body(new ZodValidationPipe(receivePayableAndAssignorSchema))
    body: ReceivePayableAndAssignorBodySchema
  ) {
    const { assignor, payable } = body;

    const createAssignorResult = await this.createAssignor.execute({
      assignor: {
        id: randomUUID(),
        document: assignor.document,
        email: assignor.email,
        name: assignor.name,
        phone: assignor.phone,
      },
    });

    if (createAssignorResult.isLeft()) {
      const error = createAssignorResult.value;

      throw new BadRequestException(error.message);
    }

    const createPayableResult = await this.createPayable.execute({
      payable: {
        id: randomUUID(),
        assignorId: createAssignorResult.value.assignor.id.toString(),
        emissionDate: new Date(payable.emissionDate),
        value: payable.value,
      },
    });

    const {
      id: payableId,
      assignorId,
      emissionDate,
      value,
    } = createPayableResult.value.payable;

    const { id, document, email, phone, name } =
      createAssignorResult.value.assignor;

    return {
      payable: PayablePresenter.toHTTP({
        id: payableId.toString(),
        assignorId: assignorId.toString(),
        emissionDate,
        value,
      }),
      assignor: AssignorPresenter.toHTTP({
        id: id.toString(),
        document,
        email,
        name,
        phone,
      }),
    };
  }
}