import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(
    private storage: Storage,
    private http: HttpClient,
    ) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  public async get(key: string) {
    return await this._storage?.get(key);
  }

 async clear()
  {
    await this._storage.clear();
  }

  async getAll()
  {
    return await this._storage.keys();
  }

  //set token oneSignal
  setOneSignalToken(filter:any)
  {
    return this.http.post(`${environment.basurl}/apis/token`, JSON.stringify(filter) )
      .pipe(map(data => {
        return data;
    })).toPromise();
  }

}
