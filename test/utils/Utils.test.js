import * as Util from "../../app/utils/Utils";

test("Format Money Based On Vietnamese Currency", () => {
    expect(Util.formatMoney(50000)).toBe("50.000");
});

test("Format Date ", () => {
    expect(Util.reformatDateTime("2022-11-29T16:57:51.000+00:00")).toBe(
        "2022-11-29 16:57:51"
    );
});

test("Format Date 1", () => {
    expect(
        Util.formatCreatedDateType(
            new Date("Wed Nov 30 2022 01:49:40 GMT+0700 (Indochina Time)")
        )
    ).toBe("2022-11-30 1:49:40");
});

test("Format Date 2", () => {
    expect(Util.formatDateTimeFromData("2022-11-03 10:02:31")).toBe(
        "03-11-2022"
    );
});

test("Format Account Role 1", () => {
    expect(Util.formatAccountRole("ROLE_CUSTOMER")).toBe("Customer");
});

test("Format Account Role 2", () => {
    expect(Util.formatAccountRole("ROLE_SHIPPER")).toBe("Shipper");
});

test("Get User Role 1", () => {
    expect(Util.getUserRole("ROLE_CUSTOMER")).toBe("customer");
});

test("Get User Role 2", () => {
    expect(Util.getUserRole("ROLE_SHIPPER")).toBe("shipper");
});

test("Get User Role By Id 1", () => {
    expect(Util.getUserRoleById(1)).toBe("Admin");
});

test("Get User Role By Id 2", () => {
    expect(Util.getUserRoleById(2)).toBe("Customer");
});

test("Get User Role By Id 3", () => {
    expect(Util.getUserRoleById(3)).toBe("Shop");
});

test("Get User Role By Id 4", () => {
    expect(Util.getUserRoleById(4)).toBe("Shipper");
});

test("Calculate Ship Fee With Policy 1", () => {
    expect(
        Util.calculateShipFee(2000, [
            {
                id: 34,
                shopId: 20,
                name: "0 - 3 km",
                price: 5000,
                categoryCost: 2,
                detail: "Giá tiền của đơn hàng shipper tính từ 0-3 km ",
            },
            {
                id: 35,
                shopId: 20,
                name: "3 - 5 km",
                price: 5000,
                categoryCost: 2,
                detail: "Giá tiền của đơn hàng shipper tính từ 3-5 km ",
            },
            {
                id: 36,
                shopId: 20,
                name: "5 +1 km",
                price: 5000,
                categoryCost: 2,
                detail: "Giá tiền của đơn hàng tính shipper từ từ 5km trở lên mỗi  1km ",
            },
        ])
    ).toBe(5000);
});

test("Calculate Ship Fee With Policy 2", () => {
    expect(
        Util.calculateShipFee(4000, [
            {
                id: 34,
                shopId: 20,
                name: "0 - 3 km",
                price: 5000,
                categoryCost: 2,
                detail: "Giá tiền của đơn hàng shipper tính từ 0-3 km ",
            },
            {
                id: 35,
                shopId: 20,
                name: "3 - 5 km",
                price: 5000,
                categoryCost: 2,
                detail: "Giá tiền của đơn hàng shipper tính từ 3-5 km ",
            },
            {
                id: 36,
                shopId: 20,
                name: "5 +1 km",
                price: 5000,
                categoryCost: 2,
                detail: "Giá tiền của đơn hàng tính shipper từ từ 5km trở lên mỗi  1km ",
            },
        ])
    ).toBe(5000);
});

test("Calculate Ship Fee With Policy 3", () => {
    expect( 
        Util.calculateShipFee(12000, [
            {
                id: 34,
                shopId: 20,
                name: "0 - 3 km",
                price: 5000,
                categoryCost: 2,
                detail: "Giá tiền của đơn hàng shipper tính từ 0-3 km ",
            },
            {
                id: 35,
                shopId: 20,
                name: "3 - 5 km",
                price: 5000,
                categoryCost: 2,
                detail: "Giá tiền của đơn hàng shipper tính từ 3-5 km ",
            },
            {
                id: 36,
                shopId: 20,
                name: "5 +1 km",
                price: 5000,
                categoryCost: 2,
                detail: "Giá tiền của đơn hàng tính shipper từ từ 5km trở lên mỗi  1km ",
            },
        ])
    ).toBe(40000);
});
