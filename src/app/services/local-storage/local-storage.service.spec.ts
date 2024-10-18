import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in localStorage', () => {
    const key = 'testKey';
    const value = { name: 'Test' };
    service.setItem(key, value);

    const storedValue = localStorage.getItem(key);
    expect(storedValue).toBeTruthy();
    expect(JSON.parse(storedValue!)).toEqual(value);
  });

  it('should get an item from localStorage', () => {
    const key = 'testKey';
    const value = { name: 'Test' };
    localStorage.setItem(key, JSON.stringify(value));

    const retrievedValue = service.getItem<{ name: string }>(key);
    expect(retrievedValue).toEqual(value);
  });

  it('should return null for a non-existent item', () => {
    const retrievedValue = service.getItem<{ name: string }>('nonExistentKey');
    expect(retrievedValue).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    const key = 'testKey';
    localStorage.setItem(key, JSON.stringify({ name: 'Test' }));

    service.removeItem(key);
    const retrievedValue = localStorage.getItem(key);
    expect(retrievedValue).toBeNull();
  });

  it('should clear all items from localStorage', () => {
    localStorage.setItem('key1', JSON.stringify({ name: 'Test1' }));
    localStorage.setItem('key2', JSON.stringify({ name: 'Test2' }));

    service.clear();
    expect(localStorage.length).toBe(0);
  });

  it('should handle setting and getting complex objects', () => {
    const key = 'complexKey';
    const complexValue = { name: 'Test', details: { age: 30, active: true } };
    service.setItem(key, complexValue);

    const retrievedValue = service.getItem<typeof complexValue>(key);
    expect(retrievedValue).toEqual(complexValue);
  });

  it('should not throw an error when removing a non-existent item', () => {
    expect(() => service.removeItem('nonExistentKey')).not.toThrow();
  });
});
