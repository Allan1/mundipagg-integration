'use strict';

module.exports.removeNonAlpha = function(str) {
  var rgPtAlphabet = /[^A-Za-záàâãéèêìíîïòóôõöúùûçñÁÀÂÃÉÈÊÌÍÏÎÒÓÔÕÖÙÚÛÇÑ]+/g;
  return str.replace(rgPtAlphabet, '');
};
