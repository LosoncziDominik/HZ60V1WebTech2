import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogDetails } from './catalog-details';

describe('CatalogDetails', () => {
  let component: CatalogDetails;
  let fixture: ComponentFixture<CatalogDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
