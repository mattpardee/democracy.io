/**
 * Helpers for working with responses from the SmartyStreets API.
 */

var camelcaseKeys = require("camelcase-keys");
var isEmpty = require("lodash.isempty");
var us = require("us");
const _ = require("lodash");

var models = require("../../../models");

/**
 *
 * @param {SmartyStreets.USStreetAPI.Candidate} rawAddress
 */
var makeCanonicalAddressFromSSResponse = function(rawAddress) {
  var addressBits = [
    rawAddress.delivery_line_1,
    rawAddress.delivery_line_2,
    rawAddress.last_line
  ];

  var address = addressBits
    .filter(addressBit => !isEmpty(addressBit))
    .join(", ");

  var components = rawAddress.components;
  var usRegion = us.lookup(components.state_abbreviation);
  // @ts-ignore
  components.stateName = usRegion !== undefined ? usRegion.name : "";

  var district = rawAddress.metadata.congressional_district;

  return new models.CanonicalAddress({
    inputId: rawAddress.input_id,
    inputIndex: rawAddress.input_index,
    address: address,
    longitude: rawAddress.metadata.longitude,
    latitude: rawAddress.metadata.latitude,
    district: district == "AL" ? "0" : district,
    county: rawAddress.metadata.county_name,
    components: camelcaseKeys(components)
  });
};

module.exports.makeCanonicalAddressFromSSResponse = makeCanonicalAddressFromSSResponse;
