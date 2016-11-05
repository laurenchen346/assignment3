var Transform = require('stream').Transform;
var util = require( "util" ).inherits;
var program = require('commander');
var fileSystem = require("fs");

function PatternMatch( pattern ) {
        if ( ! ( this instanceof PatternMatch ) ) {
            return( new PatternMatch ( pattern ) );
        }
        Transform.call(this,{objectMode: true});
        this._pattern = pattern ;
}
util(PatternMatch, Transform);
PatternMatch.prototype._transform = function (chunk, encoding, getNextChunk){
    var stringChunk = chunk.toString();
    var splitArray = stringChunk.split(this._pattern);
    this._lastLineData = splitArray.splice(splitArray.length-1,1)[0];
    this.push(splitArray);
    getNextChunk();
};
PatternMatch.prototype._flush = function (flushCompleted) {
    this._lastLineData = null;
    flushCompleted();
};
program.option('-p, --pattern <pattern>', 'Input Pattern such as . ,').parse(process.argv);
var args = program.pattern;
var inputStream = fileSystem.createReadStream( "input-sensor.txt" );
var patternMatchStream = inputStream.pipe( new PatternMatch(args));
patternMatchStream.on('readable', function() {
        var final;
        while ((final = patternMatchStream.read()) !== null) {
                console.log(final);
        }
});

