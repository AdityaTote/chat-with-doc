import math

def cosine_similarity(a: list[int], b: list[int]) -> float:
  dot, norm_a, norm_b = 0, 0, 0

  for i in range(0, len(a)):
    dot += a[i] * b[i]
    norm_a += a[i] * a[i]
    norm_b += b[i] * b[i]
  
  return dot / (math.sqrt(norm_a) * math.sqrt(norm_a))