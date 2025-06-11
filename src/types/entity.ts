export type EntityStatus = 'Ativo' | 'Inativo'

export type Entity = {
    id: string
    name: string
    email: string
    status: EntityStatus
}
