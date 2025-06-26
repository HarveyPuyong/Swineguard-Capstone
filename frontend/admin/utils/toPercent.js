function toPercent (count, total) {
   return total > 0 ? Math.round((count / total) * 100) : 0
}

export default toPercent;