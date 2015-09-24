import Operation from '../../base/operation';
import chai from 'chai';

export default class UserCreation extends Operation {

  constructor () {
    super();

    this._reqData = {
      username: 'lenin',
      password: '123456',
      full_name: 'Vladimir Ilyich Lenin',
    };
  }

  _request (app) {
    return chai.request(app)
      .post('/api/users')
      .send(this._reqData);
  }

  _check (res, data) {
    res.status.should.equal(200);
    res.body.__v.should.equal(0);
    res.body.username.should.equal(this._reqData.username);
    res.body.full_name.should.equal(this._reqData.full_name);
    res.body.image_url.should.equal('/images/default_avatar.jpg');
    res.body.created.should.exist;
    res.body._id.should.exist;
  }
}
