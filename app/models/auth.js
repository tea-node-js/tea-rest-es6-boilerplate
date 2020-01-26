const U = require('../lib/utils');
const ModelBase = require('./base');

const TOKEN_ERROR = Error('Token error.');
const USER_NO_EXISTS = Error('User dont exists.');
const USER_STATUS_ERROR = Error('User had disabled.');
const USER_DELETED_ERROR = Error('User had deleted.');

let readUserByToken = async token => {
  const Auth = U.model('auth');

  const auth = await Auth.findByToken(token);

  if (!auth) throw TOKEN_ERROR;

  const User = U.model('user');

  const user = await User.findByPk(auth.creatorId);

  if (!user) throw USER_NO_EXISTS;

  if (user.status === 'disabled') throw USER_STATUS_ERROR;

  if (user.isDelete === 'yes') throw USER_DELETED_ERROR;

  const _user = user.toJSON();
  _user.auth = auth.toJSON();

  return _user;
};

/* tea-cache 是否初始化了 */
if (U.cache) {
  readUserByToken = U.cache.caching(
    readUserByToken,
    300,
    token => `Token::${token}`
  );
}

module.exports = (sequelize, DataTypes, Op) => {
  const Auth = U._.extend(
    sequelize.define(
      'auth',
      {
        id: {
          type: DataTypes.type('integer.unsigned'),
          primaryKey: true,
          autoIncrement: true
        },
        token: {
          type: DataTypes.type('string', 32),
          allowNull: false,
          unique: true,
          comment: '存放 token'
        },
        refreshToken: {
          type: DataTypes.type('string', 32),
          allowNull: false,
          unique: true,
          comment: 'refreshToken'
        },
        expiredAt: {
          type: DataTypes.type('date'),
          allowNull: false,
          comment: '过期时间'
        },
        onlineIp: {
          type: DataTypes.type('string', 15),
          allowNull: false,
          comment: '创建者即登陆者IP'
        },
        creatorId: {
          type: DataTypes.type('integer.unsigned'),
          allowNull: false,
          comment: '创建者，即关联用户'
        }
      },
      {
        comment: '登陆授权表',
        freezeTableName: true,
        hooks: {
          afterDestroy(auth) {
            /** 清楚cache，这样禁用用户，或者修改密码后可以使得之前的token立即失效 */
            if (U.cache) {
              U.cache.del(`Token::${auth.token}`);
            }
          }
        }
      }
    ),
    ModelBase,
    {
      sort: {
        default: 'id',
        allow: ['id', 'name', 'updatedAt', 'createdAt']
      }
    }
  );

  Auth.findByToken = async function(token) {
    /** 常规模式，到 auth 表根据 token 查询 */
    if (!(U.isTest && token.substr(0, 6) === 'MOCK::')) {
      const auth = await this.findOne({
        where: {
          token,
          expiredAt: { [Op.gte]: new Date() }
        }
      });

      return auth;
    }

    const User = U.model('user');

    const user = await User.findByPk(token.substr(6));

    if (!user) throw USER_NO_EXISTS;

    if (user.status === 'disabled') throw USER_NO_EXISTS;

    if (user.isDelete === 'yes') throw USER_NO_EXISTS;

    const auth = await Auth.generator(user, '127.0.0.1');

    return auth;
  };

  /** 生成一条新的数据 */
  Auth.generator = async (user, onlineIp) => {
    return Auth.create({
      token: U.randStr(32),
      refreshToken: U.randStr(32),
      expiredAt: U.moment().add(1, 'days'),
      onlineIp,
      creatorId: user.id
    });
  };

  Auth.addAuth = (user, onlineIp) => {
    return Auth.generator(user, onlineIp);
  };

  Auth.readUserByToken = readUserByToken;

  return Auth;
};
