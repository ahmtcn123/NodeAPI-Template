import { BaseService, ServiceResponse } from "../../utils";
import { LoginInput } from "./core/user";


class User extends BaseService {

    async login(loginInput: LoginInput): Promise<ServiceResponse<void>> {
        console.log('login');

        return this.emptySuccess();
    }


    async register(data: any): Promise<ServiceResponse<void>> {
        console.log('register', data);

        return this.emptySuccess();
    }
}


export default User;