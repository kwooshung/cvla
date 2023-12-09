import Validate from '.';

describe('@/utils/version/validate/index.ts', () => {
  it('有效的版本号', () => {
    expect(Validate('1.0.0')).toBeTruthy();
    expect(Validate('2.10.3')).toBeTruthy();
    expect(Validate('0.0.1')).toBeTruthy();
    expect(Validate('1.0.0+01')).toBeTruthy();
    expect(Validate('1.0.0-alpha')).toBeTruthy();
    expect(Validate('1.0.0-0.3.7')).toBeTruthy();
    expect(Validate('1.0.0-alpha.1')).toBeTruthy();
    expect(Validate('1.0.0-x.7.z.92')).toBeTruthy();
    expect(Validate('1.0.0+20130313144700')).toBeTruthy();
    expect(Validate('1.0.0-beta+exp.sha.5114f85')).toBeTruthy();
  });

  it('无效的版本号', () => {
    expect(Validate('')).toBeFalsy();
    expect(Validate('1')).toBeFalsy();
    expect(Validate('1.0')).toBeFalsy();
    expect(Validate('a.b.c')).toBeFalsy();
    expect(Validate('1.0.0-')).toBeFalsy();
    expect(Validate('1.0.0+')).toBeFalsy();
    expect(Validate('01.0.0')).toBeFalsy();
    expect(Validate('1.01.0')).toBeFalsy();
    expect(Validate('1.0.0-01')).toBeFalsy();
    expect(Validate('1.0.0+beta+')).toBeFalsy();
  });
});
