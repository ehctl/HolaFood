import * as Request from "../../../app/core/apis/Requests.tsx";

test("Login Api",async () => {
    Request.login(
        'tuanlinh29718@gmail.com',
        '321',
        (response) => {
            expect(response.success).toStrictEqual(true);
        },
        (e) => {
        }
    )
});

test("Login Api 1",async () => {
    Request.login(
        'tuanlinh29718@gmail.com',
        '321',
        (response) => {
           
        },
        (e) => {
            expect(response.success).toStrictEqual(false);
        }
    )
});

test("Logout Api",async () => {
    Request.logout(
        (response) => {
            expect(response.success).toStrictEqual(true);
        },
        (e) => {
        }
    )
});

test("Verify Email Api",async () => {
    Request.verifyEmail(
        'tuanlinh29721@gmail.com',
        (response) => {
            expect(response.success).toStrictEqual(true);
        },
        (e) => {
        }
    )
});

test("Register Api",async () => {
    Request.signup(
        'nguyen vu',
        'tuanlinh',
        "asdads",
        "tuanlinh29722@gmail.com",
        "0968559427",
        (response) => {
           
        },
        (e) => {
            expect(response.success).toStrictEqual(false);
        }
    )
});

test("Reset Password Api",async () => {
    Request.signup(
        "tuanlinh29722@gmail.com",
        (response) => {
            expect(response.success).toStrictEqual(true);
        },
        (e) => {
        }
    )
});
