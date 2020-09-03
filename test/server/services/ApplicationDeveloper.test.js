const ApplicationDeveloper = require(`${serverRoot}/services/ApplicationsDeveloper`);
const applicationDeveloper = new ApplicationDeveloper();
const logger = require(`${serverRoot}/config/winston`);

const request = require('axios');
const chai = require('chai');
const assert = chai.assert;

const apiKeyData = require(`${testRoot}/server/_fakes/data/services/apiKeys`);
const appData = require(`${testRoot}/server/_fakes/data/services/singleApplication`);

describe('services/ApplicationDeveloper', () => {
  let stubLogger;

  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    stubLogger = sinon.stub(logger, 'info').returns(true); // why does this fail if its a const but nor otherwise???
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  const baseOptions = {
    headers: {
      // authorization: this.server.apiKey
      content_type: 'application/json'
    },
    responseType: 'json'
  };

  it('should correctly get the base options for the Api Client Service', () => {
    const opts = applicationDeveloper._getBaseOptions();
    expect(opts).to.have.own.property('headers')
      .to.have.own.property('content_type')
      .that.is.equal('application/json');
    expect(opts).to.have.own.property('responseType')
      .that.is.equal('json');
  });

  it('should fetch Api Keys from the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockId = 'test';
    const finalVars = Object.assign({}, baseOptions);
    finalVars.method = 'GET';
    finalVars.url = mockURL + '/applications/' + mockId + '/api-clients?items_per_page=20&start_index=0';
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(apiKeyData.getApiKeyList));
    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;

    // Call method
    expect(applicationDeveloper.getKeysForApplication(mockId, mockEnv))
    // Assertions
      .to.eventually.eql(apiKeyData.getApiKeyList);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithMatch(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });

  it('should fetch single Applications from the applications.api service', () => {
    // static test vars
    const mockEnv = 'mock';
    const mockURL = 'https://mocksite.com';
    const mockId = 'test';
    const finalVars = Object.assign({}, baseOptions);
    finalVars.method = 'GET';
    finalVars.url = mockURL + '/applications/' + mockId;
    // Create stubs
    const stubOpts = sinon.stub(ApplicationDeveloper.prototype, '_getBaseOptions').returns(baseOptions);
    const stubAxios = sinon.stub(request, 'request').returns(Promise.resolve(appData.singleApp.data.getApplication));
    // Inject stubs
    applicationDeveloper.request = stubAxios;
    applicationDeveloper.server.baseUrl.mock = mockURL;

    // Call method
    expect(applicationDeveloper.getApplication(mockId, mockEnv))
    // Assertions
      .to.eventually.eql(appData.singleApp.data.getApplication);
    expect(stubAxios).to.have.been.calledOnce;
    expect(stubAxios).to.have.been.calledWithExactly(finalVars);
    expect(stubOpts).to.have.been.calledOnce;
    expect(stubLogger).to.have.been.calledOnce;
  });
});
