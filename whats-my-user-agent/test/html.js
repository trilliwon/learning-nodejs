const app = require("../app");
const supertest = require("supertest");
const cheerio = require("cheerio");

describe("html response", function() {
  let request;
  beforeEach(function() {
    request = supertest(app)
      .get("/")
      .set("User-Agent", "a cool browser")
      .set("Accept", "text/html");
  });

  it("returns an HTML response", function(done) {
    request
      .expect("Content-Type", /html/)
      .expect(200)
      .end(done);
  });

  it("returns your User Agent ", function(done) {
    request
      .expect(function(res) {
        const htmlReponse = res.text;
        const $ = cheerio.load(htmlReponse);
        const userAgent = $(".user-agent")
          .html()
          .trim();
        if (userAgent !== "a cool browser") {
          throw new Error("User Agent not found");
        }
      })
      .end(done);
  });
});
