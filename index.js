const R = require('ramda')
const uuid = require('uuid/v4')
const word = require('@specialblend/word')
const { parse } = require('uuid-parse')
const upperFirst = require('lodash.upperfirst')

const { apply, curry, join, length, map, mathMod, nth, pipe, splitEvery, useWith } = R
const { adjectives, adverbs, nouns } = word

const toUint32Arr = data => new Uint32Array(data)
const toUint32Number = data => Buffer.from(data).readInt32LE()
const toNumber = pipe(toUint32Arr, toUint32Number)

const atIndex = (l, i) =>  nth(mathMod(i, length(l)), l)

const toWord = curry(atIndex)
const toAdverb = toWord(adverbs)
const toAdjective = toWord(adjectives)
const toNoun = toWord(nouns)
const toWordSet = useWith(Array, [toAdverb, toAdjective, toNoun, toNoun])
const toUpperFirst = map(upperFirst)
const toSingleWorld = join('')

const toBytes = pipe(parse, splitEvery(4), map(toNumber))
const toWords = pipe(apply(toWordSet), toUpperFirst, toSingleWorld)

const toUcn = pipe(toBytes, toWords)

const id = uuid()
const ucn = toUcn(id)

console.log({ id, ucn })
