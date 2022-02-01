'use strict';

const Firebase = require('./firebase');
const { promises: fs } = require('fs');

describe('Firebase', function() {

  describe('createCredentialsJSON', function() {
    it('should create a json file with content', async function() {
      const config = {
        firebase: {
          credentials: {
            path: 'credentials.json',
            content: '{"test":"content"}'
          }
        }
      };

      const status = await Firebase.createCredentialsJSON(config);
      const file = await fs.readFile(config.firebase.credentials.path, 'utf8');

      await fs.unlink(config.firebase.credentials.path);

      expect(status.success).to.eql(true);
      expect(status.message).to.eql('> Credentials JSON creation successfull');
      expect(file).to.eql(config.firebase.credentials.content);
    });

    it('should send error message if JSON is not valid', async function() {
      const config = {
        firebase: {
          credentials: {
            path: 'credentials.json',
            content: '{test:"content"}'
          }
        }
      };

      const status = await Firebase.createCredentialsJSON(config);

      expect(status.success).to.eql(false);
      expect(status.message).to.eql('> JSON input is not valid');
    });

    it('should send error message if can\'t write file', async function() {
      const config = {
        firebase: {
          credentials: {
            path: '.',
            content: '{"test":"content"}'
          }
        }
      };

      const status = await Firebase.createCredentialsJSON(config);

      expect(status.success).to.eql(false);
      expect(status.message).to.eql('> Writing JSON file failed');
    });
  });
});
