import mock from '../../mock';
import { usersList } from '../../jwt';
mock.onPost('api/v2/users/current/read').reply(() => [
    200,
    {
        data: {
            ...usersList[0],
        },
    },
]);
//# sourceMappingURL=index.js.map