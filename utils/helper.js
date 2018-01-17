const crypto = require('crypto')
const pickBy = require('lodash.pickby')
const jwt = require('jsonwebtoken')
const config = require('../config')
const redis = require('../config/redis')

function purify (obj) {
  return pickBy(obj, x => x != null && x !== '')
}

function generatePwd (pwd) {
  return crypto.createHash('md5').update(pwd).digest('hex') + crypto.createHash('sha1').update(pwd).digest('hex')
}

function isAdmin (profile) {
  if (profile == null || profile.privilege == null) return false
  if (parseInt(profile.privilege) === config.privilege.Root || parseInt(profile.privilege) === config.privilege.Teacher) {
    return true
  } else {
    return false
  }
}

function isRoot (profile) {
  if (profile == null || profile.privilege == null) return false
  if (parseInt(profile.privilege) === config.privilege.Root) {
    return true
  } else {
    return false
  }
}

const createToken = async (ctx, next) => {
  const uid = ctx.session.profile.uid
  const token = jwt.sign({
    uid
  }, 'acm309', {
    expiresIn: '60 * 60' // 过期时间设置为3600s
  })
  return token
}

const pushToJudge = (sid) => {
  redis.lpush('oj:solutions', sid)
}

module.exports = {
  generatePwd,
  purify,
  createToken,
  isAdmin,
  isRoot,
  pushToJudge
}