import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesChat } from './cookies-chat';

describe('CookiesChat', () => {
  let component: CookiesChat;
  let fixture: ComponentFixture<CookiesChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiesChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiesChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
