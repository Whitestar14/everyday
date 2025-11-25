import { describe, it, expect } from 'vitest'
import { parseTaskInput } from '../ParsingService'
import { createRRule, getNextOccurrence } from '../RecurrenceService'
import { buildTaskFromText } from '../TaskFactory'
import { RRule } from 'rrule'

describe('Task parsing and recurrence', () => {
  const samples = [
    'clean room everyday starting tomorrow at 9am',
    'submit report every Monday by 10am',
    'buy milk tomorrow',
    'team meeting first Tuesday of month',
    'go jogging every other week on Friday',
  ]

  samples.forEach((input) => {
    it(`handles input: "${input}"`, () => {
      // Step 1: Parse
      const parsed = parseTaskInput(input, { returnISO: false })
      expect(parsed).toBeDefined()

      // Step 2: Build recurrence if raw exists
      if (parsed.recurrence?.raw) {
        const { rule } = createRRule(parsed.recurrence.raw, {
          dtstart: (parsed.startDate as Date) || (parsed.dueDate as Date),
        })
        expect(rule).toBeDefined()

        if (rule) {
          const r = RRule.fromString(rule.rrule)
          const next = getNextOccurrence(r, new Date())
          expect(next).toBeInstanceOf(Date)
        }
      }

      // Step 3: Build full task
      const { text, metadata, type } = buildTaskFromText(input)
      expect(text).toContain(input.split(' ')[0]) // crude sanity check
      expect(metadata).toBeDefined()
      expect(type).toBeDefined()
    })
  })
})
