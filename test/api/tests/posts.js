import chai from 'chai';
import server, { app } from 'server';
import { setup } from '../setup';


let url = '/api/users/:username/posts';
let env = {};

let post = {
  description: 'Tea party',
  image_urls: ['http://image.jpg'],
  address: 'London, castle',
};

let createdPost;

describe('Posts API', () => {
  before(done => {
    setup(server, app, env, () => done());
  });

  it('POST /api/users/profile/posts should create and return post of current user', done => {
    chai.request(app)
      .post(url.replace(':username', 'profile'))
      .set('X-Access-Token', env.user.token.value)
      .send(post)
      .then(res => {
        createdPost = res.body;

        res.status.should.equal(200);
        res.body.__v.should.equal(0);
        res.body.user_id.should.equal(env.user._id);
        res.body.description.should.equal(post.description);
        res.body.image_urls.should.deep.equal(post.image_urls);
        res.body.address.should.equal(post.address);
        res.body._id.should.exist;
        res.body.created.should.exist;
        done();
      })
      .catch(err => done(err));
  });

  it('GET /api/users/:username/posts should return list of user posts', done => {
    chai.request(app)
      .get(url.replace(':username', env.user.username))
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(1);
        res.body.page.should.equal(1);
        res.body.per_page.should.equal(20);
        res.body.collection.length.should.equal(1);
        res.body.collection[0].should.deep.equal(createdPost);
        done();
      })
      .catch(err => done(err));
  });
});
