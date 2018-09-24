const singular = (item) => ({
  'visits':        item.nb_visits,
  'views':         item.nb_hits,
  'avgGeneration': item.avg_time_generation,
  'avgRetention':  item.avg_time_on_page,
  'exitRate':      item.exit_rate,
  'bounceRate':    item.bounce_rate,
  'totalTime':     item.sum_time_spent,
})

export default (input) => {
  if (!Array.isArray(input)) {
    return singular(input)
  }

  if (input.length === 0) {
    return {
      'visits':        0,
      'views':         0,
      'avgGeneration': 0,
      'avgRetention':  0,
      'exitRate':      '0%',
      'bounceRate':    '0%',
      'totalTime':     0,
    }
  }

  return input.map(singular)[0]
}
