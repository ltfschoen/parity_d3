let chai = require('chai');
let expect = chai.expect;

let app = require('../js/main.js');

describe("Job", function() {
  describe("constructor", function() {
    it("should have a bar labels", function() {
      let job = new app.job.Job();
      expect(job.barLabels[0]).to.equal("profile");
    });
  });

  describe("#isBarLabel", function() {
    it("should return true if property or its parent parameter matches list to use bar label", function() {
      expect(new app.job.Job().isBarLabel("profile", "")).to.equal(true);
    });
  });
});