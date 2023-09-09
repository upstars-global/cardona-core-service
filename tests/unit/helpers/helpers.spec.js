import { convertCamelCase, convertLowerCaseFirstSymbol, getPermissionKeys, transformFormData, } from '../../../src/helpers';
import { FieldInfo, FieldType } from '../../../src/@model/field';
import { getLocaleDateStringWithoutTimezone } from '../../../src/helpers/date';
import { DemoForm } from '../../../src/@model/demo';
describe('helpers', () => {
    describe('convertCamelCase', () => {
        it('should convert camel case string with hyphen separator', () => {
            const input = 'convertCamelCase';
            const separator = '-';
            const expectedOutput = 'convert-camel-case';
            const result = convertCamelCase(input, separator);
            expect(result).toEqual(expectedOutput);
        });
        it('should convert camel case string with underscore separator', () => {
            const input = 'convertCamelCase';
            const separator = '_';
            const expectedOutput = 'convert_camel_case';
            const result = convertCamelCase(input, separator);
            expect(result).toEqual(expectedOutput);
        });
        it('should convert camel case string with dot separator', () => {
            const input = 'convertCamelCase';
            const separator = '.';
            const expectedOutput = 'convert.camel.case';
            const result = convertCamelCase(input, separator);
            expect(result).toEqual(expectedOutput);
        });
        it('should convert camel case string with space separator', () => {
            const input = 'convertCamelCase';
            const separator = ' ';
            const expectedOutput = 'convert camel case';
            const result = convertCamelCase(input, separator);
            expect(result).toEqual(expectedOutput);
        });
    });
    describe('convertLowerCaseFirstSymbol', () => {
        it('should convert string with first symbol in lower case', () => {
            const input = 'Convert';
            const expectedOutput = 'convert';
            const result = convertLowerCaseFirstSymbol(input);
            expect(result).toEqual(expectedOutput);
        });
        it('should keep string as is if first symbol is already in lower case', () => {
            const input = 'convert';
            const expectedOutput = 'convert';
            const result = convertLowerCaseFirstSymbol(input);
            expect(result).toEqual(expectedOutput);
        });
        it('should convert string with first symbol in lower case and keep the rest of the string', () => {
            const input = 'CONVERT';
            const expectedOutput = 'cONVERT';
            const result = convertLowerCaseFirstSymbol(input);
            expect(result).toEqual(expectedOutput);
        });
    });
    describe('transformFormData', () => {
        it('transformFormData with empty form', () => {
            const form = {};
            const formData = {};
            const result = transformFormData(form);
            expect(result).toEqual(formData);
        });
        it('transformFormData with demo form', () => {
            const formData = {
                id: 'testMockId',
                image: 'test/path',
                switch: false,
                text: 'testMockText',
                number: 123,
                minute: 23,
                percent: 21,
                digits: 1234,
                email: 'test@mock.com',
                sumRange: [12, 11],
                phone: '+123121212',
                password: 'test!Mock232',
                switchWithState: false,
                check: false,
                checkGroup: [true, false, true, true, true],
                radio: true,
                date: '2023-07-27T03:00:00+00:00',
                dateRange: '2023-07-27T03:00:00+00:00',
                dateTime: '2023-07-27T03:00:00+00:00',
                dateBtn: '2023-07-27T03:00:00+00:00',
                select: 'option1',
                multiSelect: ['option1', 'option2'],
                textarea: 'textarea mock',
                textareaWithCounter: 'textarea with counter mock',
                url: '/mock/url',
                tags: ['test', 'mock'],
                seo: {
                    title: 'seo mock',
                },
                localisationParameters: {},
                fieldTranslations: {},
            };
            const form = new DemoForm(formData);
            const expectForm = {
                ...formData,
                date: getLocaleDateStringWithoutTimezone(formData.date),
                dateTime: getLocaleDateStringWithoutTimezone(formData.dateTime),
            };
            const result = transformFormData(form);
            Object.keys(result).forEach((key) => {
                expect(result[key]).toEqual(expectForm[key]);
            });
        });
        it('should transform form data with BaseField correctly', () => {
            const form = {
                field1: new FieldInfo({
                    type: FieldType.Text,
                    label: '',
                    key: 'value1',
                    value: 'asdasd',
                }),
                field2: new FieldInfo({
                    type: FieldType.Text,
                    label: '',
                    key: 'value1',
                    value: 'asdasd',
                }),
            };
            const transformedData = transformFormData(form);
            expect(transformedData).toEqual({
                field1: 'asdasd',
                field2: 'asdasd',
            });
        });
        it('should transform form data with FieldInfo correctly', () => {
            const form = {
                field1: new FieldInfo({
                    type: FieldType.Text,
                    label: '',
                    key: 'value1',
                    value: 'asdasd',
                }),
                field2: new FieldInfo({
                    type: FieldType.Tags,
                    label: '',
                    key: 'value1',
                    value: ['asdasd', 'asdasd', '2123123'],
                }),
            };
            const transformedData = transformFormData(form);
            expect(transformedData).toEqual({
                field1: 'asdasd',
                field2: ['asdasd', 'asdasd', '2123123'],
            });
        });
        it('should transform form data with nested objects correctly', () => {
            const form = {
                field1: {
                    subField1: new FieldInfo({
                        type: FieldType.Text,
                        label: '',
                        key: 'value1',
                        value: 'subValue1',
                    }),
                    subField2: new FieldInfo({
                        type: FieldType.Text,
                        label: '',
                        key: 'value2',
                        value: 'subValue2',
                    }),
                },
                field2: {
                    subField3: new FieldInfo({
                        type: FieldType.Text,
                        label: '',
                        key: 'value3',
                        value: 'subValue3',
                    }),
                    subField4: new FieldInfo({
                        type: FieldType.Text,
                        label: '',
                        key: 'value4',
                        value: 'subValue4',
                    }),
                },
            };
            const transformedData = transformFormData(form);
            expect(transformedData).toEqual({
                field1: {
                    subField1: 'subValue1',
                    subField2: 'subValue2',
                },
                field2: {
                    subField3: 'subValue3',
                    subField4: 'subValue4',
                },
            });
        });
    });
    describe('getPermissionKeys', () => {
        it('should return permission keys with default prefix and converted entity name', () => {
            const config = {
                entityNamePermission: 'User',
            };
            const expectedOutput = {
                permissionKey: 'user',
                permissionKeySeo: 'user-seo',
                permissionKeyReport: 'user-report',
            };
            const result = getPermissionKeys(config);
            expect(result).toEqual(expectedOutput);
        });
        it('should return permission keys with custom prefix and provided permission key', () => {
            const config = {
                permissionKey: 'create',
                permissionPrefix: 'admin',
            };
            const expectedOutput = {
                permissionKey: 'admin-create',
                permissionKeySeo: 'admin-create-seo',
                permissionKeyReport: 'admin-create-report',
            };
            const result = getPermissionKeys(config);
            expect(result).toEqual(expectedOutput);
        });
        it('should throw a TypeError if no permission detected', () => {
            const config = {};
            expect(() => {
                getPermissionKeys(config);
            }).toThrow(Error);
        });
    });
});
//# sourceMappingURL=helpers.spec.js.map