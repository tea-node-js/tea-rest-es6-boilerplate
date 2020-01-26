const U = require('../lib/utils');
const ModelBase = require('./base');

module.exports = (sequelize, DataTypes) => {
  const Log = U._.extend(
    sequelize.define(
      'log',
      {
        id: {
          type: DataTypes.type('integer.unsigned'),
          primaryKey: true,
          autoIncrement: true
        },
        method: {
          type: DataTypes.type('string', 10),
          allowNull: false,
          comment: '请求方法'
        },
        uri: {
          type: DataTypes.type('string', 1024),
          allowNull: false,
          comment: '请求的路径'
        },
        userId: {
          type: DataTypes.type('uuid'),
          allowNull: false,
          defaultValue: 0,
          comment: '请求用户id'
        },
        statusCode: {
          type: DataTypes.type('integer'),
          allowNull: false,
          comment: '请求状态， 2xx， 4xx, 5xx'
        },
        clientIp: {
          type: DataTypes.type('string', 15),
          allowNull: false,
          comment: '请求来源IP'
        },
        params: {
          type: DataTypes.type('text'),
          comment: '请求的参数数据'
        },
        response: {
          type: DataTypes.type('text'),
          comment: '请求返回的内容'
        }
      },
      {
        comment: '写操作日志表',
        freezeTableName: true,
        /** 禁止更新日志的记录，因为日志不需要更新操作 */
        updatedAt: false
      }
    ),
    ModelBase,
    {
      sort: {
        default: 'id',
        allow: ['id', 'method', 'userId', 'statusCode', 'createdAt']
      },
      writableCols: []
    }
  );

  return Log;
};
