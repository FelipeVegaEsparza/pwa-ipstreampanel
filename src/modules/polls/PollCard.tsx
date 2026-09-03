import { useState } from 'react'
import type { Poll } from '@/core/types'
import { votePoll } from '@/core/api'
import { useTenant } from '@/core/config/TenantContext'
import { Card } from '@/ui'
import styles from './PollCard.module.css'

function pollKey(pollId: string): string {
  return `poll_${pollId}`
}

interface PollCardProps {
  poll: Poll
}

export function PollCard({ poll }: PollCardProps) {
  const tenant = useTenant()
  const clientId = tenant.status === 'ready' ? tenant.clientId : null
  const [voted, setVoted] = useState(() => localStorage.getItem(pollKey(poll.id)) === 'true')
  const [updated, setUpdated] = useState<Poll | null>(null)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const data = updated ?? poll
  const totalVotes = data.options.reduce((sum, option) => sum + option.votes, 0)

  async function handleVote(optionId: string) {
    if (!clientId || voting) return
    setVoting(true)
    setError(null)
    try {
      const updatedPoll = await votePoll(clientId, poll.id, optionId)
      localStorage.setItem(pollKey(poll.id), 'true')
      setUpdated(updatedPoll)
      setVoted(true)
    } catch {
      setError('No se pudo enviar tu voto. Intenta de nuevo.')
    } finally {
      setVoting(false)
    }
  }

  return (
    <Card>
      <div className={styles.body}>
        <h3 className={styles.title}>{data.title}</h3>

        {voted ? (
          <ul className={styles.results}>
            {data.options.map((option) => {
              const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
              return (
                <li key={option.id} className={styles.resultRow}>
                  <div className={styles.resultMeta}>
                    <span>{option.text}</span>
                    <span className={styles.resultCount}>
                      {option.votes} · {pct}%
                    </span>
                  </div>
                  <div className={styles.bar}>
                    <div className={styles.barFill} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <ul className={styles.options}>
            {data.options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={styles.optionBtn}
                  disabled={voting}
                  onClick={() => handleVote(option.id)}
                >
                  {option.text}
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </Card>
  )
}
