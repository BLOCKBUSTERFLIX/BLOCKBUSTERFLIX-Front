import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityReadDeleteComponent } from './entity-read-delete.component';

describe('EntityReadDeleteComponent', () => {
  let component: EntityReadDeleteComponent;
  let fixture: ComponentFixture<EntityReadDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityReadDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntityReadDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
