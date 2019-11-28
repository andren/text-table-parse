import { hello } from "../main";
import { expect } from "chai";
import "mocha";

describe("First test", () => {
    it("should return true", () => {
        const result = hello();
        expect(result).to.equal("Hello world!");
    });
});

// ID                                   Name                              Roles
// --                                   ----                              -----
// becedd69-8539-4d5e-a9f8-82d6569c6c4b cssiot                            Administrator
// d343c263-4aa3-4558-adbb-d3fc34631800 Microsoft                         Administrator
// f33183ab-4b45-4b16-a8cd-a9aa83d11e6a bentho test migration             Administrator
// e663e40d-36a6-431a-a9f5-34e41e53d02a Health_POET_AzureSphere           Contributor
// 4b2d2dcd-76e1-40b4-b785-c83b5a87fb40 --manisha-test-tenant             Contributor
// 11a76bfd-099e-4cde-baa2-b40b9e0189e6 'devinwonTenantforAzureSphereLab' Reader