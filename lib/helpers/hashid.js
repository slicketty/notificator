/**
 * Hashid helpers
 */

const { isNumber } = require('lodash')
const Hashids = require('hashids')
const { assets } = require('/config')

const hashids = new Hashids(process.env.HASHID_KEY, 14)

/* Check if value is HashId */
const isHashid = value => {
  if (isNumber(value)) return false
  if (typeof value === 'string' && value.length === 14) return true
  return false
}

/* Get Id from HashId */
const getId = value => (isHashid(value) ? hashids.decode(value)[1] : value)

/**
 * Encode to HashId using asset code, first digit of asset Id
 * and random number between 0 and 1000
 */
const encode = (type, id) =>
  hashids.encode(assets[type], getId(id), Math.floor(Math.random() * 1000) + 1)

module.exports = { encode }
