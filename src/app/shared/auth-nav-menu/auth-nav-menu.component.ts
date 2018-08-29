import { of as observableOf, Observable } from 'rxjs';

import { map, filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { fadeInOut, fadeOut } from '../animations/fade';
import { HostWindowService } from '../host-window.service';
import { AppState, routerStateSelector } from '../../app.reducer';
import { isNotUndefined } from '../empty.util';
import {
  getAuthenticatedUser,
  isAuthenticated,
  isAuthenticationLoading
} from '../../core/auth/selectors';
import { Eperson } from '../../core/eperson/models/eperson.model';
import { LOGIN_ROUTE, LOGOUT_ROUTE } from '../../core/auth/auth.service';

@Component({
  selector: 'ds-auth-nav-menu',
  templateUrl: './auth-nav-menu.component.html',
  styleUrls: ['./auth-nav-menu.component.scss'],
  animations: [fadeInOut, fadeOut]
})
export class AuthNavMenuComponent implements OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;

  /**
   * True if the authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  public isXsOrSm$: Observable<boolean>;

  public showAuth = observableOf(false);

  public user: Observable<Eperson>;

  constructor(private store: Store<AppState>,
              private windowService: HostWindowService) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  ngOnInit(): void {
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    this.user = this.store.pipe(select(getAuthenticatedUser));

    this.showAuth = this.store.pipe(
      select(routerStateSelector),
      filter((router: RouterReducerState) => isNotUndefined(router) && isNotUndefined(router.state)),
      map((router: RouterReducerState) => {
        return !router.state.url.startsWith(LOGIN_ROUTE) && !router.state.url.startsWith(LOGOUT_ROUTE);
      })
    );
  }
}
