const SUT = require('../index').Action;
const expect = require('expect');
const describe = require('mocha').describe;
const it = require('mocha').it;
const request = require('supertest');
const express = require('express');
const CriteriaBuilder = require('../lib/CriteriaBuilder');


const criteriaBuilder = new CriteriaBuilder();

describe('Action', () => {
    describe('when the execute property is not set', () => {
        it('should throw an exception', () => {
            expect(() => {
                SUT({
                   criteriaBuilder: criteriaBuilder
                })
            }).toThrow()
        });
    });

    describe('when the execute property is not a function', () => {
        it('should throw an exception', () => {
            expect(() => {
                SUT({execute: 'foo'})
            }).toThrow()
        })
    });

    describe('when the criteriaBuilder property is not set', () => {
        it('should throw an exception', () => {
            expect(() => {
                SUT({
                    execute: () => {}
                })
            }).toThrow();
        });
    });

    describe('when an action is built', () => {
        it('should return a function', () => {
            const sut = SUT({
               criteriaBuilder: criteriaBuilder,
                execute: () => {
                }
            });
            expect(() => {
                sut();
            }).toNotThrow()
        });

        it('should have an expose method', () => {
            const sut = SUT({
               criteriaBuilder: criteriaBuilder,
                execute: () => {
                }
            });
            expect(sut.expose).toNotBe(undefined);
        });
    });

    describe('when cache options is given', () => {
        it('should set the cache property to the returned function', () => {
            let cacheOpts = {foo: 'bar'};
            const sut = SUT({
               criteriaBuilder: criteriaBuilder,
                execute: () => {
                }, cache: cacheOpts
            });
            expect(sut.cache).toEqual(cacheOpts);
        })
    });

    describe('when an action is executed', () => {
        it('should have normalized context', () => {
            let cacheOpts = {foo: 'bar'};
            const sut = SUT({
               criteriaBuilder: criteriaBuilder,
                execute: (context) => {
                    expect(context.criteria).toNotBe(undefined);
                }, cache: cacheOpts
            });

            sut({});
        })
    });

    describe('when a valid action is exposed', () => {
        it('should be callable from a middleware', (done) => {
            const sut = SUT({
               criteriaBuilder: criteriaBuilder,
                execute: (context) => {
                    return Promise.resolve(true);
                }
            });

            const collab = express();
            collab.use((req, res, next) => {res.submit = res.send; next();}, sut.expose());

            request(collab)
                .get('/')
                .expect(200, done)
        });
    });


    describe('when an invalid action is exposed', () => {
        it('should be callable from a middleware', (done) => {
            const sut = SUT({
                criteriaBuilder: criteriaBuilder,
                execute: (context) => {
                    return Promise.reject();
                }
            });

            const collab = express();
            collab.use((req, res, next) => {res.error = (err) => {res.status(500).send()}; next();}, sut.expose());

            request(collab)
                .get('/')
                .expect(500, done)
        });
    });
});