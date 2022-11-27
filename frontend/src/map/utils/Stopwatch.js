import Lib from 'openfl/lib/openfl/Lib';

export default class Stopwatch {

	static startTime;

	static start() {
		Stopwatch.startTime = Lib.getTimer();
	}

	static lap() {
		return Lib.getTimer() - Stopwatch.startTime;
	}

	static next() {
		var curTime = Lib.getTimer();
		var result = curTime - Stopwatch.startTime;
		Stopwatch.startTime = curTime;
		return result;
	}

	static measure( fn ) {
		Stopwatch.start(); fn(); return Stopwatch.next();
	}
}