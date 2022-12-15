import {
    getFailValidation,
    getSuccessValidation,
} from "../../app/validation/validate";
import * as Validate from "../../app/validation/validate.tsx";

test("Validate Success Result ", () => {
    expect(getSuccessValidation()).toStrictEqual({
        qualify: true,
        message: "",
    });
});

test("Validate Failure Result ", () => {
    expect(getFailValidation("")).toStrictEqual({
        qualify: false,
        message: "",
    });
});

test("Validate Normal Text", () => {
    expect(Validate.isValidNormalText("normalText")).toStrictEqual(
        getSuccessValidation()
    );
});

test("Validate Normal Text 1", () => {
    expect(Validate.isValidNormalText("")).toStrictEqual(
        getFailValidation("Text can not empty")
    );
});

test("Validate Name", () => {
    expect(Validate.isValidName("Nguyễn Vũ Tuấn Linh")).toStrictEqual(
        getSuccessValidation()
    );
});

test("Validate Name 1", () => {
    expect(Validate.isValidName("Nguyễn Vũ Tuấn Linh123")).toStrictEqual(
        getFailValidation("Name is incorrect format")
    );
});

test("Validate Phone Number", () => {
    expect(Validate.isValidPhoneNumber("0968550429")).toStrictEqual(
        getSuccessValidation()
    );
});

test("Validate Phone Number 1", () => {
    expect(Validate.isValidPhoneNumber("096855042123123213sđa9")).toStrictEqual(
        getFailValidation("Phone number is incorrect format")
    );
});

test("Validate Email", () => {
    expect(Validate.isValidEmail("tuanlinh@gmail.com")).toStrictEqual(
        getSuccessValidation()
    );
});

test("Validate Email 1", () => {
    expect(Validate.isValidEmail("tuanlinhgmail.com")).toStrictEqual(
        getFailValidation("Email is incorrect format")
    );
});
