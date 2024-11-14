export const TEST_USERS = [
    {
        firstName: "firstName1",
        lastName: "lastName1",
        email: `email1`,
        passHash: `passHash1`,
        registeredAt: 438918
    },
    {
        firstName: "firstName2",
        lastName: "lastName2",
        email: `email2`,
        passHash: `passHash2`,
        registeredAt: 2358970
    },
    {
        firstName: "firstName3",
        lastName: "lastName3",
        email: `email3`,
        passHash: `passHash3`,
        registeredAt: 9184317
    }
];

export const TEST_LOGINS = [
    {
        ip: 1,
        loginAt: 984931,
        user: TEST_USERS[0]
    },
    {
        ip: 1,
        loginAt: 9849352,
        user: TEST_USERS[0]
    },
    {
        ip: 2,
        loginAt: 231513,
        user: TEST_USERS[1]
    },
]