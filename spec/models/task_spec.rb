require 'spec_helper'

describe Task, type: :model do
  let(:task) { FactoryGirl.build :task }
  subject { task }

  it { should respond_to(:title) }
  it { should respond_to(:description) }
  it { should respond_to(:open) }
  it { should respond_to(:lat) }
  it { should respond_to(:lon) }

  it { should respond_to(:user_id) }

  it { should validate_presence_of :title }
  it { should validate_presence_of :description }
  it { should validate_presence_of :lon }
  it { should validate_presence_of :lat }

  it { should belong_to :user }

end