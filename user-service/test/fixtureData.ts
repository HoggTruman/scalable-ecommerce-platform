export const TEST_USERS = [
    {
        firstName: "firstName1",
        lastName: "lastName1",
        email: `email1`,
        password: 'a'.repeat(60),
        registeredAt: 438918
    },
    {
        firstName: "firstName2",
        lastName: "lastName2",
        email: `email2`,
        password: 'b'.repeat(60),
        registeredAt: 2358970
    },
    {
        firstName: "firstName3",
        lastName: "lastName3",
        email: `email3`,
        password: 'c'.repeat(60),
        registeredAt: 9184317
    }
];


export const TEST_LOGINS = [
    {
        ip: "ip1",
        loginAt: 984931,
        user: TEST_USERS[0]
    },
    {
        ip: "ip2",
        loginAt: 9849352,
        user: TEST_USERS[0]
    },
    {
        ip: "ip3",
        loginAt: 231513,
        user: TEST_USERS[1]
    },
]