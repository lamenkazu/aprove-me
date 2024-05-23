import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/prisma/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { CreateAssignorService } from "@/domain/receivables/application/services/create-assignor-service";
import { CreatePayableService } from "@/domain/receivables/application/services/create-payable-service";
import { EditAssignorService } from "@/domain/receivables/application/services/edit-assignor-service";
import { EditPayableService } from "@/domain/receivables/application/services/edit-payable-service";
import { FindPayableByIdService } from "@/domain/receivables/application/services/find-payable-by-id";
import { RemoveAssignorService } from "@/domain/receivables/application/services/remove-assignor-service";
import { RemovePayableService } from "@/domain/receivables/application/services/remove-payable-service";
import { RegisterUserService } from "@/domain/account/application/services/register-user";
import { AuthenticateUserService } from "@/domain/account/application/services/authenticate-user";
// import { ReceivePayableAndAssignorController } from "./controllers/receive-payable-and-assignor.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { GetPayableByIdController } from "./controllers/get-payable-by-id.controller";
import { GetAssignorByIdController } from "./controllers/get-assignor-by-id.controller";
import { FindAssignorByIdService } from "@/domain/receivables/application/services/find-assignor-by-id";
import { DeleteAssignorByIdController } from "./controllers/delete-assignor-by-id.controller";
import { DeletePayableByIdController } from "./controllers/delete-payable-by-id.controller";
import { EditAssignorController } from "./controllers/edit-assignor.controller";
import { EditPayableController } from "./controllers/edit-payable.controller";
import { RegisterAssignorUserController } from "./controllers/regiter-assignor-user.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    // ReceivePayableAndAssignorController,
    AuthenticateController,
    GetPayableByIdController,
    GetAssignorByIdController,
    DeleteAssignorByIdController,
    DeletePayableByIdController,
    EditAssignorController,
    EditPayableController,
    RegisterAssignorUserController,
  ],
  providers: [
    //Account Services
    RegisterUserService,
    AuthenticateUserService,

    //Assignor Services
    CreateAssignorService,
    EditAssignorService,
    FindAssignorByIdService,
    RemoveAssignorService,

    //Payable Services
    CreatePayableService,
    EditPayableService,
    FindPayableByIdService,
    RemovePayableService,
  ],
})
export class HttpModule {}
