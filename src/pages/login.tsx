import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Key, TrendingUp } from 'lucide-react'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'magic'>('email')
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validUsers = [
    { email: 'pbernardproxy@gmail.com', phone: '+230 54557219', name: 'Patrick Ian Bernard' },
    { email: 'audrey.l.brutus@gmail.com', phone: '+230 54951814', name: 'Marie Audrey Laura Brutus' },
  ]

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    await new Promise(resolve => setTimeout(resolve, 1000))

    const isValid = validUsers.some(
      user => user.email === identifier || user.phone === identifier
    )

    if (!isValid) {
      setError('Invalid credentials. Only authorized users can access SEMDEX.')
      setLoading(false)
      return
    }

    onLogin()
    navigate('/dashboard')
  }

  const sendMagicLink = async () => {
    if (!identifier) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    await new Promise(resolve => setTimeout(resolve, 1500))

    const isValid = validUsers.some(user => user.email === identifier)
    
    if (!isValid) {
      setError('Email not found. Only authorized users can access SEMDEX.')
    } else {
      alert(`Magic link sent to ${identifier}! Check your email.`)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl mb-4">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SEMDEX</h1>
          <p className="text-blue-200">Shareholder Information Portal</p>
          <p className="text-blue-300 text-sm mt-1">MCB Group Ltd</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome Back</h2>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-4 h-4 inline-block mr-2" />
              Email
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Phone className="w-4 h-4 inline-block mr-2" />
              Phone
            </button>
            <button
              onClick={() => setLoginMethod('magic')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                loginMethod === 'magic'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Key className="w-4 h-4 inline-block mr-2" />
              Magic Link
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {loginMethod === 'email' ? 'Email Address' : loginMethod === 'phone' ? 'Phone Number' : 'Email for Magic Link'}
              </label>
              <input
                type={loginMethod === 'phone' ? 'tel' : 'email'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  loginMethod === 'email'
                    ? 'pbernardproxy@gmail.com'
                    : loginMethod === 'phone'
                    ? '+230 54557219'
                    : 'your.email@example.com'
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {loginMethod === 'magic' ? (
              <button
                onClick={sendMagicLink}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-3">Authorized Users Only</p>
            <div className="space-y-2">
              {validUsers.map((user, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-600">{user.email}</p>
                  <p className="text-xs text-slate-600">{user.phone}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full py-2 px-4 border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all">
              Use Device Biometrics
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            © 2026 SEMDEX Platform • Mauritius
          </p>
          <p className="text-blue-300 text-xs mt-1">
            Powered by MCB Group Ltd
          </p>
        </div>
      </div>
    </div>
  )
}
