import DataLoader from 'dataloader'

export interface DataLoaderBase {
  get: (loaderName: any) => DataLoader<any, any>
}

export class CacheWorker<T extends DataLoaderBase> {
  cache: DataLoaderCache<T>
  dataLoaderBase: T
  did: string
  disposeId: NodeJS.Timeout | undefined
  shared = false

  constructor(dataLoaderBase: T, did: string, cache: DataLoaderCache<T>) {
    this.dataLoaderBase = dataLoaderBase
    this.did = did
    this.cache = cache
  }

  get: T['get'] = (dataLoaderName) => {
    return this.dataLoaderBase.get(dataLoaderName)
  }

  dispose(force?: boolean) {
    const ttl = force || !this.shared ? 0 : this.cache.ttl
    clearTimeout(this.disposeId!)
    this.disposeId = global.setTimeout(() => {
      delete this.cache.workers[this.did]
    }, ttl)
  }

  share() {
    this.shared = true
    return this.did
  }
}

export default class DataLoaderCache<T extends DataLoaderBase> {
  ttl: number
  workers: {[did: string]: CacheWorker<T>} = {}
  nextId = 0
  constructor({ttl} = {ttl: 500}) {
    this.ttl = ttl
  }

  add<T>(did: string, dataLoaderBase: T) {
    this.workers[did] = new CacheWorker<any>(dataLoaderBase, did, this)
    return this.workers[did]
  }

  use(did: string) {
    return this.workers[did]
  }
}
