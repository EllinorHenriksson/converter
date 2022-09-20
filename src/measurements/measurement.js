import { Validator } from '../validator.js'

/**
 * Represents a measurement.
 *
 * @abstract
 */
export class Measurement {
  /**
   * The quantity in the given unit.
   *
   * @type {number}
   */
  #quantity

  /**
   * The given unit, with properties 'abbr' and 'ratio'.
   *
   * @type {object}
   */
  #unit

  /**
   * The standard unit quantity.
   *
   * @type {number}
   */
  #standardUnitQuantity

  /**
   * The standard unit, with properties 'abbr' and 'ratio'.
   *
   * @type {object}
   */
  #standardUnit

  /**
   * The available units of the measurement.
   *
   * @type {object}
   */
  #units

  /**
   * The validator to validate input with.
   *
   * @type {Validator}
   */
  #validator

  /**
   * Instantiates a Measurement object.
   *
   * @param {number} quantity - The quantity
   * @param {string} unit - The unit
   * @param {units} units - The available units
   */
  constructor (quantity, unit, units) {
    // Make the class abstract
    if (this.constructor === Measurement) {
      throw new Error('Class "Measurement" cannot be instantiated.')
    }

    this.#validator = new Validator()

    this.#setUnits(units)
    this.#setStandardUnit()
    this.#setQuantity(quantity)
    this.#setUnit(unit)
    this.#setStandardUnitQuantity()
  }

  /**
   * Gets a copy of the validator.
   *
   * @returns {Validator} The validator copy.
   */
  get validator () {
    return new Validator()
  }

  /**
   * Validates and sets the units of the measurement.
   *
   * @param {object} units - A reference to a units object (e.g. LengthUnits)
   */
  #setUnits (units) {
    this.#validator.validateUnits(units)
    this.#units = units
  }

  /**
   * Sets the standard measurement unit object, with properties 'abbr' and 'ratio'.
   */
  #setStandardUnit () {
    for (const key in this.#units) {
      if (this.#units[key].ratio === 1) {
        this.#standardUnit = this.#units[key]
      }
    }
  }

  /**
   * Gets the standard unit object, with properties 'abbr' and 'ratio'.
   *
   * @returns {object} The standard unit object.
   */
  get standardUnit () {
    return this.#standardUnit.abbr
  }

  /**
   * Validates and sets the quantity property.
   *
   * @param {number} quantity - The quantity
   */
  #setQuantity (quantity) {
    this.#validator.validateQuantity(quantity)
    this.#quantity = quantity
  }

  /**
   * Gets the quantity.
   *
   * @returns {number} The quantity.
   */
  get quantity () {
    return this.#quantity
  }

  /**
   * Validates and sets the measurement unit object, with properties 'abbr' and 'ratio'.
   *
   * @param {string} unit - The measurement unit abbreviation as a string
   */
  #setUnit (unit) {
    this.#validator.validateUnit(unit, this.#units)
    this.#unit = this.#retrieveUnit(unit)
  }

  /**
   * Gets the unit object, with properties 'abbr' and 'ratio'.
   *
   * @returns {object} The unit object.
   */
  get unit () {
    return this.#unit.abbr
  }

  /**
   * Retrieves the corresponding measurement unit object.
   *
   * @param {string} unit - The abbreviation of the unit to look for
   * @returns {object} The unit object, with properties 'abbr' and 'ratio'
   */
  #retrieveUnit (unit) {
    let unitObject
    for (const key in this.#units) {
      if (this.#units[key].abbr === unit) {
        unitObject = this.#units[key]
      }
    }
    return unitObject
  }

  /**
   * Calculates and sets the standard unit quantity.
   */
  #setStandardUnitQuantity () {
    // Calculates the quantity with factors to create integers out of floating point numbers, wich otherwise may cause miscalculations
    const quantityFactor = this.#getFloatFactor(this.#quantity)
    const ratioFactor = this.#getFloatFactor(this.#unit.ratio)

    this.#standardUnitQuantity = (this.#quantity * quantityFactor) * (this.#unit.ratio * ratioFactor) / (quantityFactor * ratioFactor)
  }

  /**
   * Returns a factor to use in calculations with a float to avoid miscalculations.
   *
   * @param {number} float - The float wich the factor is for
   * @returns {number} The factor
   */
  #getFloatFactor (float) {
    const floatAsString = float.toString()

    const noOfDecimalsInFloat = floatAsString.slice(floatAsString.indexOf('.')).length - 1

    return 10 ** noOfDecimalsInFloat
  }

  /**
   * Gets the standard unit quantity.
   *
   * @returns {number} The standard unit quantity.
   */
  get standardUnitQuantity () {
    return this.#standardUnitQuantity
  }

  /**
   * Converts the measurement to the given unit and returns the new measurement.
   *
   * @param {string} unit - The unit to convert to
   * @returns {Measurement} The new measurement
   */
  convertTo (unit) {
    this.#validator.validateUnit(unit, this.#units)
    const unitObject = this.#retrieveUnit(unit)
    const quantity = this.#calculateQuantity(unitObject.ratio)

    return new this.constructor(quantity, unit)
  }

  /**
   * Converts the measurement to its standard unit and returns the new measurement.
   *
   * @returns {Measurement} The new measurement
   */
  convertToStandard () {
    return this.convertTo(this.#standardUnit.abbr)
  }

  /**
   * Calculates quantity given the ratio of a unit.
   *
   * @param {number} ratio - The ratio to use in the calculation
   * @returns {number} The resulting quantity
   */
  #calculateQuantity (ratio) {
    // Calculates the quantity with factors to create integers out of floating point numbers, wich otherwise may cause miscalculations
    const quantityFactor = this.#getFloatFactor(this.#standardUnitQuantity)
    const ratioFactor = this.#getFloatFactor(ratio)

    return ((this.#standardUnitQuantity * quantityFactor) / (ratio * ratioFactor)) / (quantityFactor / ratioFactor)
  }

  /**
   * Compares this to another measurement of the same type to see if they are equal in quantity after being converted to the same unit.
   *
   * @param {Measurement} measurement The measurement to compare with
   * @returns {boolean} True or false
   */
  isEqualTo (measurement) {
    this.#validator.validateMeasurement(measurement, this.constructor)
    return this.#standardUnitQuantity === measurement.#standardUnitQuantity
  }

  /**
   * Compares this to another measurement of the same type to see if this is less in quantity after being converted to the same unit.
   *
   * @param {Measurement} measurement The measurement to compare with
   * @returns {boolean} True or false
   */
  isLessThan (measurement) {
    this.#validator.validateMeasurement(measurement, this.constructor)
    return this.#standardUnitQuantity < measurement.#standardUnitQuantity
  }

  /**
   * Compares this to another measurement of the same type to see if this is greater in quantity after being converted to the same unit.
   *
   * @param {Measurement} measurement The measurement to compare with
   * @returns {boolean} True or false
   */
  isGreaterThan (measurement) {
    this.#validator.validateMeasurement(measurement, this.constructor)
    return this.#standardUnitQuantity > measurement.#standardUnitQuantity
  }

  /**
   * Abstract method.
   *
   * @abstract
   */
  toString () {
    throw new Error('Method "toString()" must be implemented.')
  }
}
