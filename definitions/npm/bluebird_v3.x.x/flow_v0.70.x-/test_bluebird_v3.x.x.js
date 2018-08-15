// @flow
import Bluebird from 'bluebird';
import type { Disposable } from 'bluebird';

const defer: Bluebird.Defer = Bluebird.defer();
const promise: Bluebird<*> = defer.promise;
(promise.isFulfilled(): boolean);
promise.reflect().then(inspection => {
  (inspection.isCancelled(): boolean);
  (inspection.pending(): boolean);
});

// $ExpectError
new Bluebird();

let resolveUndefined: Bluebird<void> = Bluebird.resolve();
let resolveString: Bluebird<string> = Bluebird.resolve('3');
// $ExpectError
let resolveUndefinedNotNumber: Bluebird<number> = Bluebird.resolve();
// $ExpectError
let resolveNumberNotUndefined: Bluebird<void> = Bluebird.resolve(3);
// $ExpectError
let resolveNumberNotString: Bluebird<string> = Bluebird.resolve(3);

let resolveBluebirdString: Bluebird<string> = Bluebird.resolve(resolveString);
// $ExpectError
let resolveBluebirdStringNotBluebirdNumber: Bluebird<number> = Bluebird.resolve(resolveString);
// $ExpectError
let resolveBluebirdStringNotBluebirdUndefined: Bluebird<void> = Bluebird.resolve(resolveString);
// $ExpectError
let resolveBluebirdStringNotBluebirdBluebirdString: Bluebird<Bluebird<string>> = Bluebird.resolve(resolveString);

Bluebird.all([
  new Bluebird(() => {}),
]);
Bluebird.map([1], (x: number) => new Bluebird(() => {})).all();
Bluebird.map(Bluebird.resolve([1]), (x: number) => new Bluebird(() => {})).all();
Bluebird.reject('test');
Bluebird.all([
  1
]);
Bluebird.all(Promise.resolve([
  new Bluebird(() => {}),
]));

function mapper(x: number): Promise<number> {
  return Bluebird.resolve(x);
}
let mapResult: Promise<number[]> = Bluebird.map([1], mapper);
let mapSeriesResult: Promise<number[]> = Bluebird.mapSeries([1], mapper);

Bluebird.resolve([1,2,3]).then(function(arr: [1,2,3]) {
  let l = arr.length;
  // $ExpectError Property not found in Array
  arr.then(r => r);
});

let response = fetch('/').then(r => r.text())
Bluebird.resolve(response).then(function(responseBody: string) {
  let length: number = responseBody.length;
  // $ExpectError Property not found in string
  responseBody.then(r => r);
});

Bluebird.all([1, Bluebird.resolve(1), Promise.resolve(1)]).then(function(r: Array<number>) { });
Bluebird.all(['hello', Bluebird.resolve('world'), Promise.resolve('!')]).then(function(r: Array<string>) { });

Bluebird.join(1, Bluebird.resolve(2), function (a, b) { return a + b }).then(function (s) { return s + 1 })
Bluebird.join(
  1,
  Bluebird.resolve(2),
  Promise.resolve(3),
  function (a, b) { return a + b }).then(function (s) { return s + 1 })

Bluebird.join(1, Bluebird.resolve(2),
  function (a, b) { return Bluebird.resolve(a + b) }).then(function (s) { return s + 1 })

// $ExpectError
Bluebird.all([1, Bluebird.resolve(1), Promise.resolve(1)]).then(function(r: Array<string>) { });

let propsMixed1: Bluebird<{ a: number, b: number }> = Bluebird.props({ a: 3, b: 4 });
let propsMixed2: Bluebird<{ a: number, b: number }> = Bluebird.props({ a: Bluebird.resolve(3), b: Bluebird.resolve(4) });
let propsMixed3: Bluebird<{ a: number, b: string }> = Bluebird.props({ a: 3, b: '4' });
let propsMixed4: Bluebird<{ a: number }> = Bluebird.props({ a: 3, b: Bluebird.resolve('3') });
let propsMixed5: Bluebird<{ a: number, b: number, c: string }> = Bluebird.props({ a: 3, b: Bluebird.resolve(3), c: Bluebird.resolve('3'), d: Bluebird.resolve('') });
let propsMixed6: Bluebird<{ a: number, b: number, c: string }> = Bluebird.props(Bluebird.resolve({ a: 3, b: Bluebird.resolve(3), c: Bluebird.resolve('3'), d: Bluebird.resolve('') }));
// $ExpectError
let propsMixedNot1: Bluebird<void> = Bluebird.props({ a: 3, b: 4 });
// $ExpectError
let propsMixedNot2: Bluebird<{| a: number |}> = Bluebird.props({ a: 3, b: 4 });
// $ExpectError
let propsMixedNot3: Bluebird<{ a: number, b: string}> = Bluebird.props({ a: 3, b: 4 });
// $ExpectError
let propsMixedNot4: Bluebird<{ a: number, b: number}> = Bluebird.props({ a: 3, b: '4' });
// $ExpectError
let propsMixedNot5: Bluebird<{ a: number, b: string}> = Bluebird.props({ a: Bluebird.resolve(3), b: Bluebird.resolve(3) });
// $ExpectError
let propsMixedNot6: Bluebird<{ a: number, b: number}> = Bluebird.props({ a: Bluebird.resolve(3), b: Bluebird.resolve('4') });
// $ExpectError
let propsMixedNot7: Bluebird<{ a: number, b: string, c: string }> = Bluebird.props({ a: 3, b: Bluebird.resolve(3), c: Bluebird.resolve('3') });
// $ExpectError
let propsMixedNot8: Bluebird<{ a: number, b: string, c: string }> = Bluebird.props(Bluebird.resolve({ a: 3, b: Bluebird.resolve(3), c: Bluebird.resolve('3') }));

let propsMap1: Bluebird<Map<number, string>> = Bluebird.props(new Map<number, string>());
let propsMap2: Bluebird<Map<number, string>> = Bluebird.props(new Map<number, Bluebird<string>>());
let propsMap3: Bluebird<Map<Bluebird<number>, string>> = Bluebird.props(new Map<Bluebird<number>, Bluebird<string>>());
let propsMap4: Bluebird<Map<number, string>> = Bluebird.props(Bluebird.resolve(new Map<number, string>()));
let propsMap5: Bluebird<Map<number, string>> = Bluebird.props(Bluebird.resolve(new Map<number, Bluebird<string>>()));
// $ExpectError
let propsMapNot1: Bluebird<Map<number, number>> = Bluebird.props(new Map<number, string>());
// $ExpectError
let propsMapNot2: Bluebird<Map<number, number>> = Bluebird.props(new Map<number, Bluebird<string>>());
// $ExpectError
let propsMapNot3: Bluebird<Map<Bluebird<number>, number>> = Bluebird.props(new Map<Bluebird<number>, Bluebird<string>>());
// $ExpectError
let propsMapNot4: Bluebird<Map<number, number>> = Bluebird.props(Bluebird.resolve(new Map<number, string>()));
// $ExpectError
let propsMapNot5: Bluebird<Map<number, number>> = Bluebird.props(Bluebird.resolve(new Map<number, Bluebird<string>>()));
// $ExpectError
let propsMapNot6: Bluebird<{[number]: number}> = Bluebird.props(new Map<number, string>());

function foo(a: number, b: string) {
  throw new Error('oh no');
}
let fooPromise = Bluebird.method(foo);
fooPromise(1, 'b').catch(function(e) {
  let m: string = e.message;
});
fooPromise(1, 'b').catch(Error, function(e: Error) {
  let m: string = e.message;
});
// $ExpectError
fooPromise(1, 'b').catch(Error, function(e: NetworkError) {
  let m: string = e.message;
  let c: number = e.code;
});

function fooPlain (a: number, b: string) {
  return 1;
}
let fooPlainPromise = Bluebird.method(fooPlain);
fooPlainPromise(1, 'a').then(function (n: number) {
  let n2 = n;
});

function fooNative (a: number, b: string) {
  return Promise.resolve(2);
}
let fooNativePromise = Bluebird.method(fooNative);
fooNativePromise(1, 'a').then(function (n: number) {
  let n2 = n;
});

function fooBluebird (a: number, b: string) {
  return Bluebird.resolve(3);
}
let fooBluebirdPromise = Bluebird.method(fooBluebird);
fooBluebirdPromise(1, 'a').then(function (n: number) {
  let n2 = n;
});

// $ExpectError
fooPromise('a', 1)
// $ExpectError
fooPromise()

Bluebird.resolve(['arr', { some: 'value' }, 42])
  .spread((someString: string, map: Object, answer: number) => answer)
  .then(answer => answer * 2);

Bluebird.reduce([5, Bluebird.resolve(6), Promise.resolve(7)], (memo, next) => memo + next);
Bluebird.reduce([5, Bluebird.resolve(6), Promise.resolve(7)], (memo, next) => memo + next, 1);
Bluebird.reduce([5, Bluebird.resolve(6), Promise.resolve(7)], (memo, next) => memo + next, Bluebird.resolve(1));
Bluebird.reduce([5, Bluebird.resolve(6), Promise.resolve(7)], (memo, next) => memo + next, Promise.resolve(1));

Bluebird.reduce(Promise.resolve([5, Bluebird.resolve(6), Promise.resolve(7)]), (memo, next) => memo + next);
Bluebird.reduce(Bluebird.resolve([5, Bluebird.resolve(6), Promise.resolve(7)]), (memo, next) => memo + next, 1);

Bluebird.reduce([1, Bluebird.resolve(2), Promise.resolve(3)], (prev, num) => Promise.resolve(prev * num));
Bluebird.reduce([1, Bluebird.resolve(2), Promise.resolve(3)], (prev, num) => Bluebird.resolve(prev * num));

type PromiseOutput<T> = () => Promise<T>;
let givePromise1: PromiseOutput<number> = () => Promise.resolve(1);
let givePromise2: PromiseOutput<number> = () => Bluebird.resolve(2);

type PromiseInput<T> = (input: Promise<T>) => Function
let takePromise: PromiseInput<number> = (promise) => promise.then
takePromise(Promise.resolve(1));
takePromise(Bluebird.resolve(1));

Bluebird.delay(500);
Bluebird.delay(500, 1);
Bluebird.delay(500, Promise.resolve(5));
Bluebird.delay(500, Bluebird.resolve(5));

Bluebird.resolve().return(5).then((result: number) => {});
Bluebird.resolve().thenReturn(5).then((result: number) => {});
// $ExpectError
Bluebird.resolve().return(5).then((result: string) => {});
// $ExpectError
Bluebird.resolve().thenReturn(5).then((result: string) => {});

let disposable: Disposable<boolean> = Bluebird.resolve(true).disposer((value: boolean) => {});
Bluebird.using(disposable, (value: boolean) => 9).then((result: number) => {});
// $ExpectError
Bluebird.using(disposable, (value: number) => 9);
