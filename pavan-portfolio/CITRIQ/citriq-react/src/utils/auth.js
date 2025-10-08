export function getRole() {
  return localStorage.getItem('critiq_role')
}

export function requireRole(requiredRole) {
  const role = getRole()
  return role === requiredRole
}


