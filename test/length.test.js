import { jest } from '@jest/globals'
import { Length } from '../src/measurements/length.js'
import { Validator } from '../src/validator.js'

jest.mock('../src/validator.js')

describe('Length', () => {
  const length = new Length(100, 'cm')

  const validatorSpy = jest.spyOn(length, 'validator', 'get')
  const standardUnitSpy = jest.spyOn(length, 'standardUnit', 'get')
  const quantitySpy = jest.spyOn(length, 'quantity', 'get')
  const unitSpy = jest.spyOn(length, 'unit', 'get')
  const standardUnitQuantitySpy = jest.spyOn(length, 'standardUnitQuantity', 'get')
  const convertToSpy = jest.spyOn(length, 'convertTo')
  const convertToStandardSpy = jest.spyOn(length, 'convertToStandard')
  const toStringSpy = jest.spyOn(length, 'toString')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('.constructor()', () => {
    test('defines a function', () => {
      expect(typeof Length.constructor).toBe('function')
    })

    test('calls the constructor on Validator', () => {
      const result = new Length(1, 'm')
      expect(Validator).toHaveBeenCalledTimes(1)
      expect(result).toBeInstanceOf(Length)
    })
  })

  describe('.validator', () => {
    test('gets validator', () => {
      const result = length.validator
      expect(validatorSpy).toHaveBeenCalledTimes(1)
      expect(result).toBeInstanceOf(Validator)
      expect(Validator).toHaveBeenCalledTimes(1)
    })
  })

  describe('.standardUnit', () => {
    test('gets standard unit', () => {
      const result = length.standardUnit
      expect(standardUnitSpy).toHaveBeenCalledTimes(1)
      expect(result).toBe('m')
    })
  })

  describe('.quantity', () => {
    test('gets quantity', () => {
      const result = length.quantity
      expect(quantitySpy).toHaveBeenCalledTimes(1)
      expect(result).toBe(100)
    })
  })

  describe('.unit', () => {
    test('gets unit', () => {
      const result = length.unit
      expect(unitSpy).toHaveBeenCalledTimes(1)
      expect(result).toBe('cm')
    })
  })

  describe('.standardUnitQuantity', () => {
    test('gets standard unit quantity', () => {
      const result = length.standardUnitQuantity
      expect(standardUnitQuantitySpy).toHaveBeenCalledTimes(1)
      expect(result).toBe(1)
    })
  })

  describe('.convertTo', () => {
    test('converts measurement to given unit and returns new length object', () => {
      const result = length.convertTo('mm')

      expect(convertToSpy).toHaveBeenCalledTimes(1)
      expect(convertToSpy).toHaveBeenCalledWith('mm')

      expect(result).toBeInstanceOf(Length)
      expect(result.unit).toBe('mm')
      expect(result.quantity).toBe(1000)
    })
  })

  describe('.convertToStandard', () => {
    test('converts measurement to standard unit and returns new length object', () => {
      const result = length.convertToStandard()

      expect(convertToStandardSpy).toHaveBeenCalledTimes(1)

      expect(result).toBeInstanceOf(Length)
      expect(result.unit).toBe('m')
      expect(result.quantity).toBe(1)
    })
  })

  describe('.toString', () => {
    test('returns a string representation of the measurement', () => {
      const result = length.toString()

      expect(toStringSpy).toHaveBeenCalledTimes(1)

      expect(result).toBe('100cm (1m)')
    })
  })

  describe('.mergeWithInto', () => {
    test('merges measurement with other measurement, returning a new measurement in the given unit', () => {
      const result = length.mergeWithInto(new Length(50, 'cm'), 'm')

      expect(result).toBeInstanceOf(Length)
      expect(result.quantity).toBe(1.5)
      expect(result.unit).toBe('m')
    })
  })

  describe('.isEqualTo', () => {
    const validArgs = [
      new Length(100, 'cm'),
      new Length(1, 'm')
    ]
    const invalidArgs = [
      new Length(10, 'cm'),
      new Length(200, 'cm')
    ]

    test.each(validArgs)('returns true for equal measurements', fixture => {
      expect(length.isEqualTo(fixture)).toBe(true)
    })

    test.each(invalidArgs)('returns false for unequal measurements', fixture => {
      expect(length.isEqualTo(fixture)).toBe(false)
    })
  })

  describe('.isLessThan', () => {
    const validArgs = [
      new Length(200, 'cm')
    ]
    const invalidArgs = [
      new Length(10, 'cm'),
      new Length(100, 'cm'),
      new Length(1, 'm')
    ]

    test.each(validArgs)('returns true for a measurement that is lesser than the measurements passed as an argument', fixture => {
      expect(length.isLessThan(fixture)).toBe(true)
    })

    test.each(invalidArgs)('returns false for a measurement that is not lesser than the measurements passed as an argument', fixture => {
      expect(length.isLessThan(fixture)).toBe(false)
    })
  })

  describe('.isGreaterThan', () => {
    const validArgs = [
      new Length(10, 'cm')
    ]
    const invalidArgs = [
      new Length(200, 'cm'),
      new Length(100, 'cm'),
      new Length(1, 'm')
    ]

    test.each(validArgs)('returns true for a measurement that is greater than the measurements passed as an argument', fixture => {
      expect(length.isGreaterThan(fixture)).toBe(true)
    })

    test.each(invalidArgs)('returns false for a measurement that is not greater than the measurements passed as an argument', fixture => {
      expect(length.isGreaterThan(fixture)).toBe(false)
    })
  })
})
