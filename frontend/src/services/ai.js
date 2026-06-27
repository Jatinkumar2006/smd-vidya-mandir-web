import api from './api'

export const askChatbot     = async (message, history = []) => (await api.post('/ai/chat',   { message, history })).data.reply
export const generateNotice = async (topic)                  => (await api.post('/ai/notice', { topic })).data.notice
export const generateRemark = async (studentData)            => (await api.post('/ai/remark', { studentData })).data.remark
