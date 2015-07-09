require 'spec_helper'

describe Api::V1::TasksController, type: :controller do

  describe Api::V1::TasksController do
    describe "GET #show" do
      before(:each) do
        @task = FactoryGirl.create :task
        get :show, id: @task.id
      end

      it "returns the information about a task on a hash" do
        task_response = json_response[:task]
        expect(task_response[:title]).to eql @task.title
      end

      it { should respond_with 200 }
    end
  end

  describe "GET #index" do
    before(:each) do
      4.times { FactoryGirl.create :task }
      get :index
    end

    it "returns 4 records from the database" do
      tasks_response = json_response
      expect(tasks_response[:tasks]).not_to be_empty
    end
    it "returns the user object into each task" do
      tasks_response = json_response[:tasks]
      tasks_response.each do |task_response|
        expect(task_response[:user]).to be_present
      end
    end

    it { should respond_with 200 }
  end

  describe "POST #create" do
    context "when is successfully created" do
      before(:each) do
        user = FactoryGirl.create :user
        @task_attributes = FactoryGirl.attributes_for :task
        api_authorization_header user.auth_token
        post :create, { user_id: user.id, task: @task_attributes }
      end

      it "renders the json representation for the task record just created" do
        task_response = json_response[:task]
        expect(task_response[:title]).to eql @task_attributes[:title]
      end

      it { should respond_with 201 }
      end
  end

  describe "PUT/PATCH #update" do
    before(:each) do
      @user = FactoryGirl.create :user
      @task = FactoryGirl.create :task, user: @user
      api_authorization_header @user.auth_token
    end

    context "when is successfully updated" do
      before(:each) do
        patch :update, { user_id: @user.id, id: @task.id,
              task: { title: "Buy me chocolate" } }
      end

      it "renders the json representation for the updated task" do
        task_response = json_response[:task]
        expect(task_response[:title]).to eql "Buy me chocolate"
      end

      it { should respond_with 200 }
    end
  end

  describe "DELETE #destroy" do
    before(:each) do
      @user = FactoryGirl.create :user
      @task = FactoryGirl.create :task, user: @user
      api_authorization_header @user.auth_token
      delete :destroy, { user_id: @user.id, id: @task.id }
    end

    it { should respond_with 204 }
  end
end
