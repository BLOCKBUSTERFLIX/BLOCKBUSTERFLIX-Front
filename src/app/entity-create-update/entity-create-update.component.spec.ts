import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCreateUpdateComponent } from './entity-create-update.component';

describe('EntityCreateUpdateComponent', () => {
  let component: EntityCreateUpdateComponent;
  let fixture: ComponentFixture<EntityCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityCreateUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntityCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
