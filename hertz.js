/**
 * Copyrights for code authored by Yahoo Inc. is licensed under the following
 * terms:
 * MIT License
 * Copyright (c) 2016 Yahoo Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @author cary@yahoo-inc.com, johnsonb@yahoo-inc.com
 * @fileoverview Accepts an array of numeric values.  For each value, a
 * representative audible tone is generated, allowing those users with vision
 * impairments to get the "at a glance" trends that the data represents.
 */
(function (exports){
  'use strict';

  exports.hertz = function (data) {
    var current = 0;
    var maxHertz = 2000;
    var minHertz = 300;
    var toneLength = 200;
    var tonePause = 150;
    var max = Math.max.apply(Math, data);
    var min = Math.min.apply(Math, data);
    var ctx;
    var handler;
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    if (AudioContext) {
      ctx = new AudioContext();

      handler = setInterval(function() {
        var osc = ctx.createOscillator();
        var hertzSpread = maxHertz - minHertz;
        var pointSpread = max - min;
        var spreadPerPoint = hertzSpread / pointSpread;
        var tone = minHertz + (spreadPerPoint * (data[current] - min));

        osc.frequency.value = tone;
        osc.connect(ctx.destination);
        osc.start(0);

        setTimeout(function() {
          current += 1;

          osc.stop();

          if (current >= data.length) {
            ctx.close();

            clearInterval(handler);
          }
        }, toneLength);
      }, (toneLength + tonePause));
    }
  };
})((typeof module === 'object' && module.exports) ? module.exports : window);
