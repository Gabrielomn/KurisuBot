const Piii = require("piii")
const piiiFilters = require("piii-filters")
const piii = new Piii({
  filters: [
    ...Object.values(piiiFilters)
  ]
});


module.exports = piii;