const { validate } = require('../src/validator');

describe('Validator', () => {
  it('should validate obj', async () => {
    const valid = validate({
      NAME: 'prova',
      WEIGHT: '10.5',
      LENGTH: '10',
      LATITUDE: 'A',
      LONGITUDE: 'B',
      USERNAME: 'USER1',
    }, {
      IMAGE: {
        size: 839,
        path: 'C:\\Users\\HP\\AppData\\Local\\Temp\\upload_fd904779bd53d83c83c20c4547842296',
        name: 'image.jpg',
        type: 'image/jpeg',
        mtime: '2021-03-23T10:19:47.183Z',
      },
    });
    expect(valid).toBeTruthy();
  });
  it('should validate obj error NAME', async () => {
    const valid = validate({
      NAME: null,
      WEIGHT: '10.5',
      LENGTH: '10',
      LATITUDE: 'A',
      LONGITUDE: 'B',
      USERNAME: 'USER1',
    }, {
      IMAGE: {
        size: 839,
        path: 'C:\\Users\\HP\\AppData\\Local\\Temp\\upload_fd904779bd53d83c83c20c4547842296',
        name: 'image.jpg',
        type: 'image/jpeg',
        mtime: '2021-03-23T10:19:47.183Z',
      },
    });
    expect(valid).toBeFalsy();
  });
  it('should validate obj error WEIGHT', async () => {
    const valid = validate({
      NAME: null,
      WEIGHT: 'B',
      LENGTH: '10',
      LATITUDE: 'A',
      LONGITUDE: 'B',
      USERNAME: 'USER1',
    }, {
      IMAGE: {
        size: 839,
        path: 'C:\\Users\\HP\\AppData\\Local\\Temp\\upload_fd904779bd53d83c83c20c4547842296',
        name: 'image.jpg',
        type: 'image/jpeg',
        mtime: '2021-03-23T10:19:47.183Z',
      },
    });
    expect(valid).toBeFalsy();
  });
  it('should validate obj error IMAGE', async () => {
    const valid = validate({
      NAME: null,
      WEIGHT: 'B',
      LENGTH: '10',
      LATITUDE: 'A',
      LONGITUDE: 'B',
      USERNAME: 'USER1',
    }, {
      IMAGE: null,
    });
    expect(valid).toBeFalsy();
  });
});
